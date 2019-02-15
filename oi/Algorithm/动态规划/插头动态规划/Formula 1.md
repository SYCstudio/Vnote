# Formula 1
[URAL1519 BZOJ1814]

一个 m * n 的棋盘,有的格子存在障碍,求经过所有非障碍格子的哈密顿回路个数 

插头 DP ，注意要求必须是一个哈密顿回路，所以不能有内部相连的连通块，故采用括号序列的方式表示状态，转移的时候注意插头的变换，形成回路的插头必须且只能在最后一个有效格合并。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=12;
const int inf=2147483647;

int n,m;
char Mp[maxN+5][maxN+5];
ll F[2][1594323+10],P[20];

int main(){
	P[0]=1;for (int i=1;i<=15;i++) P[i]=P[i-1]*3;
	scanf("%d%d",&n,&m);
	for (int i=1;i<=n;i++) scanf("%s",Mp[i]+1);
	int lstx=0,lsty=0;
	for (int i=n;(i>=1)&&(lstx==0);i--) for (int j=m;(j>=1)&&(lstx==0);j--) if (Mp[i][j]=='.') lstx=i,lsty=j;
	int now=0,up=P[m+1];F[now][0]=1;ll Ans=0;
	for (int i=1;i<=n;i++)
		for (int j=1;j<=m;j++){
			now^=1;mem(F[now],0);
			for (int k=0;k<=up;k++)
				if (F[now^1][k]){
					int x=k%3,y=k/P[j]%3;ll key=F[now^1][k];
					if (Mp[i][j]=='*'){
						if ((x==0)&&(y==0)) F[now][k]+=key;
						continue;
					}
					if (x==0){
						if (y==0)
							if ((i<n)&&(j<m)&&(Mp[i+1][j]=='.')&&(Mp[i][j+1]=='.')) F[now][k+2+P[j]]+=key;
						if (y==1){
							if ((i<n)&&(Mp[i+1][j]=='.')) F[now][k]+=key;
							if ((j<m)&&(Mp[i][j+1]=='.')) F[now][k-P[j]+1]+=key;
						}
						if (y==2){
							if ((i<n)&&(Mp[i+1][j]=='.')) F[now][k]+=key;
							if ((j<m)&&(Mp[i][j+1]=='.')) F[now][k-P[j]*2+2]+=key;
						}
					}
					if (x==1){
						if (y==0){
							if ((i<n)&&(Mp[i+1][j]=='.')) F[now][k-1+P[j]]+=key;
							if ((j<m)&&(Mp[i][j+1]=='.')) F[now][k]+=key;
						}
						if (y==1){
							int cnt=0,p=j+1;
							while ((p<=m)&&((cnt!=0)||(k/P[p]%3!=2))){
								if (k/P[p]%3==1) ++cnt;
								if (k/P[p]%3==2) --cnt;
								++p;
							}
							if (p<=m) F[now][k-1-P[j]-P[p]]+=key;
						}
						if (y==2)
							if ((i==lstx)&&(j==lsty)) Ans+=key;
					}
					if (x==2){
						if (y==0){
							if ((i<n)&&(Mp[i+1][j]=='.')) F[now][k-2+P[j]*2]+=key;
							if ((j<m)&&(Mp[i][j+1]=='.')) F[now][k]+=key;
						}
						if (y==1) F[now][k-2-P[j]]+=key;
						if (y==2){
							int cnt=0,p=j-1;
							while ((p>=1)&&((cnt!=0)||(k/P[p]%3!=1))){
								if (k/P[p]%3==1) --cnt;
								if (k/P[p]%3==2) ++cnt;
								--p;
							}
							if (p>=1) F[now][k-2-P[j]*2+P[p]]+=key;
						}
					}
				}
		}
	printf("%lld\n",Ans);return 0;
}
```