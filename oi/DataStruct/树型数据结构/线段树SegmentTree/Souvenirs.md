# Souvenirs
[CF765F]

Artsem is on vacation and wants to buy souvenirs for his two teammates. There are $ n $ souvenir shops along the street. In $ i $ -th shop Artsem can buy one souvenir for $ a _ {i} $ dollars, and he cannot buy more than one souvenir in one shop. He doesn't want to introduce envy in his team, so he wants to buy two souvenirs with least possible difference in price.  
Artsem has visited the shopping street $ m $ times. For some strange reason on the $ i $ -th day only shops with numbers from $ l _ {i} $ to $ r _ {i} $ were operating (weird? yes it is, but have you ever tried to come up with a reasonable legend for a range query problem?). For each visit, Artsem wants to know the minimum possible difference in prices of two different souvenirs he can buy in the opened shops.  
In other words, for each Artsem's visit you should find the minimum possible value of $ |a _ {s}-a _ {t}| $ where $ l _ {i}&lt;=s,t&lt;=r _ {i} $ , $ s≠t $ .

给出n( $2 \le n \le 10^5$ ) ，一个长为n的序列a（ $0 \le a _ i \le 10^9$ )。  
给出m( $1\le m \le 2*10^5$ )，接下来m组询问。  
每组询问给出一个l,r( $ 1&lt;=l &lt; r&lt;=n $ )，代表询问最小的 $|a _ i-a _ j|$ 的值（ $l\le i &lt;j\le r$ ， $a _ i$ 可以等于 $a _ j$ ）

把询问按照右端点排序，那么从左往右扫描，维护左端点的答案。设 $F[i]$ 表示左端点在 $i$ 的答案，那么用线段树来维护之。  
对于线段树的每一个节点，维护它所包含的区间的有序序列。当右端点向右移动一个的时候，要更新左边所有的答案。因为答案从左往右是单调递增的，所以每次更新的时候，先更新右边再更新左边。如果发现，在线段树当前节点二分出来的位置的前后减去当前值比当前答案要大，则说明一定不会是更优的答案，继续向下更新是没有意义的，舍去之。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define lson (now<<1)
#define rson (lson|1)

const int maxN=101000;
const int maxM=301000;
const int inf=2e9;

class Question
{
public:
	int l,r,id;
};

int n,m;
int Seq[maxN];
vector<int> Vr[maxN<<2];
int Mn[maxN<<2],Ans[maxM];
Question Qn[maxM];

bool cmp(Question A,Question B);
void Build(int now,int l,int r);
void Modify(int now,int l,int r,int pos,int key,int &mn);
int Query(int now,int l,int r,int ql,int qr);
void Outp(int now,int l,int r);

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&Seq[i]);
	Build(1,1,n);
	scanf("%d",&m);
	for (int i=1;i<=m;i++) scanf("%d%d",&Qn[i].l,&Qn[i].r),Qn[i].id=i;
	sort(&Qn[1],&Qn[m+1],cmp);
	for (int i=1,nowr=1;i<=m;i++){
		while (nowr<Qn[i].r){
			int mn=inf;
			Modify(1,1,n,nowr,Seq[nowr+1],mn);nowr++;
		}
		Ans[Qn[i].id]=Query(1,1,n,Qn[i].l,Qn[i].r);
	}

	for (int i=1;i<=m;i++) printf("%d\n",Ans[i]);
	return 0;
}

bool cmp(Question A,Question B){
	return A.r<B.r;
}

void Build(int now,int l,int r){
	if (l==r){
		Vr[now].push_back(Seq[l]);Mn[now]=inf;return;
	}
	int mid=(l+r)>>1;
	Build(lson,l,mid);Build(rson,mid+1,r);
	int sz1=Vr[lson].size(),sz2=Vr[rson].size(),p1=0,p2=0;
	while ((p1!=sz1)||(p2!=sz2)){
		if ((p1!=sz1)&&((p2==sz2)||(Vr[lson][p1]<=Vr[rson][p2]))) Vr[now].push_back(Vr[lson][p1++]);
		else Vr[now].push_back(Vr[rson][p2++]);
	}
	Mn[now]=min(Mn[lson],Mn[rson]);
	for (int i=0,sz=Vr[now].size();i<sz-1;i++) Mn[now]=min(Mn[now],Vr[now][i+1]-Vr[now][i]);
	return;
}

void Modify(int now,int l,int r,int pos,int key,int &mn){
	if (l==r){
		mn=min(mn,abs(key-Vr[now][0]));
		Mn[now]=min(Mn[now],mn);return;
	}
	vector<int>::iterator it=lower_bound(Vr[now].begin(),Vr[now].end(),key);
	
	if ( ((it==Vr[now].end())||((*it)-key>=mn)) && ((it==Vr[now].begin())||(key-(*(it-1))>=mn)) ){
		mn=min(mn,Query(1,1,n,l,pos));
		return;
	}
	int mid=(l+r)>>1;
	if (pos>=mid+1) Modify(rson,mid+1,r,pos,key,mn),Modify(lson,l,mid,pos,key,mn);
	else Modify(lson,l,mid,pos,key,mn);
	Mn[now]=min(min(Mn[now],mn),min(Mn[lson],Mn[rson]));
	return;
}

int Query(int now,int l,int r,int ql,int qr){
	if ((l>=ql)&&(r<=qr)) return Mn[now];
	int mid=(l+r)>>1;
	if (qr<=mid) return Query(lson,l,mid,ql,qr);
	else if (ql>=mid+1) return Query(rson,mid+1,r,ql,qr);
	else return min(Query(lson,l,mid,ql,mid),Query(rson,mid+1,r,mid+1,qr));
}

void Outp(int now,int l,int r){
	cout<<"["<<l<<","<<r<<"] "<<Mn[now]<<endl;
	if (l==r) return;
	int mid=(l+r)>>1;
	Outp(lson,l,mid);Outp(rson,mid+1,r);
	return;
}
```