# High Cry
[CF875D]

Rick and Morty like to go to the ridge High Cry for crying loudly — there is an extraordinary echo. Recently they discovered an interesting acoustic characteristic of this ridge: if Rick and Morty begin crying simultaneously from different mountains, their cry would be heard between these mountains up to the height equal the bitwise OR of mountains they've climbed and all the mountains between them.  
Bitwise OR is a binary operation which is determined the following way. Consider representation of numbers x and y in binary numeric system (probably with leading zeroes) x = xk... x1x0 and y = yk... y1y0. Then z = x | y is defined following way: z = zk... z1z0, where zi = 1, if xi = 1 or yi = 1, and zi = 0 otherwise. In the other words, digit of bitwise OR of two numbers equals zero if and only if digits at corresponding positions is both numbers equals zero. For example bitwise OR of numbers 10 = 10102 and 9 = 10012 equals 11 = 10112. In programming languages C/C++/Java/Python this operation is defined as «|», and in Pascal as «or».  
Help Rick and Morty calculate the number of ways they can select two mountains in such a way that if they start crying from these mountains their cry will be heard above these mountains and all mountains between them. More formally you should find number of pairs l and r (1 ≤ l < r ≤ n) such that bitwise OR of heights of all mountains between l and r (inclusive) is larger than the height of any mountain at this interval.

or>max ，由于 or 是大于等于最大数的，所以预处理出每一个数左右第一次与它或起来超过本身的位置，这个可以用 lst 数组得到。分治最大值的位置，减去不合法的部分。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=202000;
const int maxBit=30;
const int inf=2147483647;

int n,Seq[maxN],Log[maxN];
int lst[maxBit],L[maxN],R[maxN],Mx[maxBit][maxN];
ll Ans=0;

int GetMx(int l,int r);
void Solve(int l,int r);

int main(){
	for (int i=1;i<maxN;i++) Log[i]=log2(i);
	scanf("%d",&n);for (int i=1;i<=n;i++) scanf("%d",&Seq[i]);
	mem(lst,0);
	for (int i=1;i<=n;i++){
		L[i]=0;
		for (int j=0;j<maxBit;j++)
			if (Seq[i]&(1<<j)) lst[j]=i;
			else L[i]=max(L[i],lst[j]+1);
	}
	for (int i=0;i<maxBit;i++) lst[i]=n+1;
	for (int i=n;i>=1;i--){
		R[i]=n+1;
		for (int j=0;j<maxBit;j++)
			if (Seq[i]&(1<<j)) lst[j]=i;
			else R[i]=min(R[i],lst[j]-1);
	}

	for (int i=1;i<=n;i++) Mx[0][i]=i;
	for (int i=1;i<maxBit;i++)
		for (int j=1;j+(1<<(i-1))<=n;j++)
			if (Seq[Mx[i-1][j]]>=Seq[Mx[i-1][j+(1<<(i-1))]]) Mx[i][j]=Mx[i-1][j];
			else Mx[i][j]=Mx[i-1][j+(1<<(i-1))];

	Solve(1,n);
	printf("%lld\n",1ll*n*(n-1)/2-Ans);

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
	int p=GetMx(l,r);
	Ans=Ans+1ll*(p-max(L[p],l)+1)*(min(R[p],r)-p+1)-1;
	Solve(l,p-1);Solve(p+1,r);
}
```