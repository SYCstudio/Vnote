# 取余最大值Yura and Developers
[51nod1472,CF549F]

有一个长度为n的数组a，现在要找一个长度至少为2的子段，求出这一子段的和，然后减去最大值，然后对k取余结果为0。  
问这样的子段有多少个。  
样例解释：下标从1开始，对应的三个区间为[1:3],[1:4],[3:4]

分治最大值，枚举小的那一边，查大的那一边。   
由于空间限制，不能使用主席树的在线做法，而应当把询问离线下来，用树状数组+扫描线的方式来做。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
#include<vector>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=300030;
const int maxK=1010000;
const int maxBit=19;
const int inf=2147483647;

class Question{
public:
	int l,r;
};

int n,K;
int Seq[maxN],Mx[maxBit][maxN],Sum[maxN],Log[maxN];
ll Ans=0,Bit[maxK],qcnt;
vector<Question> Qs[maxK];
int Order[maxN];

int GetMx(int l,int r);
void Solve(int l,int r);
bool cmp(int a,int b);
void Add(int pos,int key);
int Pre(int pos);

int main(){
	for (int i=1;i<maxN;i++) Log[i]=log2(i);
	scanf("%d%d",&n,&K);
	for (int i=1;i<=n;i++){
		scanf("%d",&Seq[i]);Mx[0][i]=i;
		Sum[i]=(Sum[i-1]+Seq[i])%K;
	}

	for (int i=1;i<maxBit;i++)
		for (int j=1;j+(1<<(i-1))<=n;j++)
			if (Seq[Mx[i-1][j]]>=Seq[Mx[i-1][j+(1<<(i-1))]]) Mx[i][j]=Mx[i-1][j];
			else Mx[i][j]=Mx[i-1][j+(1<<(i-1))];

	Solve(1,n);

	for (int i=0;i<=n;i++) Order[i]=i;
	sort(&Order[0],&Order[n+1],cmp);

	for (int i=0,j=-1;i<K;i++){
		int lastj=j;
		while ((j<n)&&(Sum[Order[j+1]]<=i)) Add(Order[++j],1);
		for (int sz=Qs[i].size(),k=0;k<sz;k++)
			Ans=Ans+Pre(Qs[i][k].r)-Pre(Qs[i][k].l-1);
		for (int k=lastj+1;k<=j;k++) Add(Order[k],-1);
	}

	printf("%lld\n",Ans);

	return 0;
}

int GetMx(int l,int r){
	int lg=Log[r-l+1];
	if (Seq[Mx[lg][l]]>=Seq[Mx[lg][r-(1<<lg)+1]]) return Mx[lg][l];
	else return Mx[lg][r-(1<<lg)+1];
}

void Solve(int l,int r){
	if (l==r) return;
	if (l>r) return;

	int mxp=GetMx(l,r),mx=Seq[mxp];
	if (mxp-l+1<=r-mxp+1){
		for (int i=mxp;i>=l;i--)
			Qs[(mx+Sum[i-1])%K].push_back((Question){mxp+1,r});
		Solve(l,mxp);Solve(mxp+1,r);
	}
	else{
		if (mxp-2>=0) 
			for (int i=mxp;i<=r;i++){
				if (l-1<=0) Qs[((Sum[i]-mx)%K+K)%K].push_back((Question){0,mxp-2});
				else Qs[((Sum[i]-mx)%K+K)%K].push_back((Question){l-1,mxp-2});
			}
		Solve(l,mxp-1);Solve(mxp,r);
	}
	return;
}

bool cmp(int a,int b){
	return Sum[a]<Sum[b];
}

void Add(int pos,int key){
	pos++;
	while (pos<=n+1){
		Bit[pos]+=key;pos+=(pos)&(-pos);
	}
	return;
}

int Pre(int pos){
	int ret=0;
	pos++;
	while (pos){
		ret+=Bit[pos];pos-=((pos)&(-pos));
	}
	return ret;
}
```